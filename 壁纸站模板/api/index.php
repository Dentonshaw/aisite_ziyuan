<?php
error_reporting(0);
ini_set('open_basedir', NULL);
ini_set('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.106 Safari/537.36');
ini_set('session.use_trans_sid', '1');
ini_set('session.use_only_cookies', '0');
ini_set('session.use_cookies', '1');

$interval = 864000;
if(isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])){
    $c_time = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE'])+$interval;
    if($c_time > time()){
        header('HTTP/1.1 304 Not Modified');
		header('Status: 304 Not Modified');
		exit(0);
    }
}
header("Cache-Control:max-age=".$interval);
header("Expires: ".gmdate('D, d M Y H:i:s',time()+$interval)." GMT");
header("Last-Modified: ".gmdate('D, d M Y H:i:s')." GMT");

$cid = getParam('cid', '360new');
switch($cid){
    case '360new':
        $start = getParam('start', 0);
        $count = getParam('count', 10);
        echojson(file_get_contents("http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByOrder&order=create_time&start={$start}&count={$count}&from=360chrome"));
    break;
    
    case '360tags':
        echojson(file_get_contents("http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAllCategoriesV2&from=360chrome"));
    break;
    
    case 'bing':
        $start = getParam('start', -1);
        $count = getParam('count', 8);
        echojson(file_get_contents("http://cn.bing.com/HPImageArchive.aspx?format=js&idx={$start}&n={$count}"));
    break;
    
    default:
        $start = getParam('start', 0);
        $count = getParam('count', 10);
        echojson(file_get_contents("http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&cid={$cid}&start={$start}&count={$count}&from=360chrome"));  
}

/**
 * 获取GET或POST过来的参数
 * @param $key 键值
 * @param $default 默认值
 * @return 获取到的内容（没有则为默认值）
 */
function getParam($key,$default=''){
    return trim($key && is_string($key) ? (isset($_POST[$key]) ? $_POST[$key] : (isset($_GET[$key]) ? $_GET[$key] : $default)) : $default);
}

/**
 * 输出一个json或jsonp格式的内容
 * @param $data 数组内容
 */
function echojson($data){
    header('Content-type: application/json');
    $callback = getParam('callback');
    if($callback != '') {
        die(htmlspecialchars($callback).'('.$data.')');
    } else {
        die($data);
    }
}
exit(0);
?>