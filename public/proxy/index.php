<?php
class CachedFile {
    private $_ttl;
    private $_url;

    private $_cache_filename;
    private $_meta_filename;

    private $_cache_contents = NULL;
    private $_meta_contents = NULL;

    function __construct(string $url) {
        $cache_dir =  __DIR__ . '/tmp/';
        if (!file_exists($cache_dir)) {
            mkdir($cache_dir, 0777);
        }
        $filehash = hash('sha256', $url);

        $this->_ttl = 3600;
        $this->_url = $url;
        $this->_cache_filename = $cache_dir . $filehash;
        $this->_meta_filename = $this->_cache_filename . '.json';
    }

    public function exists() {
        return file_exists($this->_cache_filename) && file_exists($this->_meta_filename);
    }
    public function valid() {
        return $this->exists() && (filemtime($this->_cache_filename) + $this->_ttl) > time();        
    }

    public function cache() {
        if ($this->exists() && is_null($this->_cache_contents)) {
            $this->_cache_contents = file_get_contents($this->_cache_filename);
        }
        return $this->_cache_contents;
    }
    public function meta() {
        return json_decode(file_get_contents($this->_meta_filename), true);
    }

    public function save(string $contents, array $meta = null) {
        $this->_cache_contents = $contents;
        file_put_contents($this->_cache_filename, $this->_cache_contents);

        if (!is_null($meta)) {
            $this->_meta_contents = json_encode($meta, JSON_PRETTY_PRINT);
            file_put_contents($this->_meta_filename, $this->_meta_contents);    
        }
    }

    public function delete() {
        if ($this->exists()) {
            unlink($this->_cache_filename);
            unlink($this->_meta_filename);
        }
    }

    public function filename() { return $this->cache_filename; }
    public function metaname() { return $this->_meta_filename; }
    public function url() { return $this->_url; }
}

class CachingProxy {
    private static function output_headers(CachedFile $file) {
        $info = $file->meta();
        $filename = $file->filename();
      
        http_response_code(200);
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: ' . $info['content_type']);
        header('Content-Length: ' . filesize($filename));
    }

    private static function parse_opt($trans, $opt) {
        $options = array(
            'width' => 0,
            'height' => 0,
            'scale' => 1,
            'enlarge' => true
        );
        switch ($trans) {
            case 'fitHeight':
            case 'maxHeight':
                $options['height'] = intval(opt);
                break;
            case 'fitWidth':
            case 'maxWidth':
                $options['width'] = intval($opt);
                break;
            case 'max':
            case 'fit':
                list($w, $h) = explode('x', $opt);
                $options['width'] = intval($w);
                $options['height'] = intval($h);
                break;
            case 'scale':
                $options['scale'] = floatval($opt);
                break;
        }
        if (strpos($trans, 'max') !== false) {
            $options['enlarge'] = false;
        }
        return $options;
    }
    private static function transform(CachedFile $file, string $transform, string $options) {
        // $meta = $file->meta();
        // if (strpos($meta['content_type'], 'image/') !== false) {
        //     $resize = new ImageResize($file->filename());
        //     $transformations = array_combine(
        //         explode(',', $transform),
        //         explode(',', $options)
        //     );
        //     foreach ($transformations as $trans => $op) {
        //         $opt = self::parse_opt($trans, $op);
        //         switch ($trans) {
        //             case 'fitHeight':
        //             case 'maxHeight':
        //                 $resize->resizeToHeight($opt['height'], $opt['enlarge']);
        //                 break;
        //             case 'fitWidth':
        //             case 'maxWidth':
        //                 $resize->resizeToWidth($opt['width'], $opt['enlarge']);
        //                 break;
        //             case 'fit':
        //             case 'max':
        //                 $resize->resizeToBestFit($opt['width'], $opt['height'], $opt['enlarge']);
        //                 break;
        //             case 'scale':
        //                 $resize->scale($opt['scale']);
        //                 break;
        //         }
        //     }
        //     $newimage = $resize->getImageAsString();
        //     $file->save($newimage);
        // }
    }

    private static function download_file(CachedFile $file) {
        $headers = getallheaders();
        $headers['Authorization'] = 'Bearer keyQv7zDQbinENVcQ';
        $curl_options = array( 
            CURLOPT_VERBOSE => true, 
            CURLOPT_URL => $file->url(), 
            CURLOPT_FOLLOWLOCATION => true, 
            CURLOPT_RETURNTRANSFER => true, 
            CURLOPT_ENCODING => '',
            CURLOPT_HTTPHEADER => array_map(
                static function ($value, $key) {
                    if (!in_array($key, array('Origin', 'Referer', 'Connection', 'Host'))) {
                        return $key . ':' . $value;
                    }
                },
                $headers,
                array_keys($headers)
            )
        );

        $curl = curl_init();
        curl_setopt_array($curl, $curl_options);
        $result = curl_exec($curl);
        if ($result !== false) {
            $file->save($result, curl_getinfo($curl));
        }  
        curl_close($curl);
    }

    private static function get(CachedFile $file, array $options) {
        if ($options['overwrite'] || !$file->valid()) {
            self::download_file($file);
            if ($options['transform'] !== false) {
                self::transform($file, $options['transform'], $options['options']);
            }
        }
        self::output_headers($file);
        print $file->cache();
    }

    private static function options() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: accept, x-requested-with, content-type');      
    }

    public static function handle_request(string $method, ?string $url, array $options) {
        if ($method === 'OPTIONS') {
            self::options();
        } else if (!is_null($url)) {
            $file = new CachedFile($url);

            if ($method === 'DELETE') {
                $file->delete();
            } else {
                self::get($file, $options);
            }
        } else {
            http_response_code(400);
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$options = array(
    'overwrite' => isset($_GET['overwrite']),
    'transform' => isset($_GET['transform']) ? $_GET['transform'] : false,
    'options' => isset($_GET['options']) ? $_GET['options'] : false
);
$url = '';

if (isset($_GET['endpoint'])) {
    $url = 'https://api.airtable.com/v0/appxuBPxu0RLPPdpO/' . str_replace('/', '', $_GET['endpoint']);
} else if (isset($_GET['image'])) {
    $url = 'https://dl.airtable.com/.attachments/' . $_GET['image'];
}

CachingProxy::handle_request($method, $url, $options);

exit();
