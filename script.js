var pf;
function deviceCheck() {
    document.write(navigator.platform)
    // 디바이스 종류 설정
    var pcDevice = "win16|win32|win64|mac";
 
    // 접속한 디바이스 환경
    if ( navigator.platform ) {
        if ( pcDevice.indexOf(navigator.platform.toLowerCase()) < 0 ) {
            pf = "MOBILE";
        } else {
            pf = "PC";
        }
    }
}
deviceCheck();