/**
 * Created by ptmind on 2018/12/29.
 */
function start() {
    function oauthSignIn() {
        let href = 'https://accounts.google.com/o/oauth2/v2/auth?' +
            'scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly&' +
            'access_type=offline&' +
            'include_granted_scopes=true&' +
            'state=state_parameter_passthrough_value&' +
            'redirect_uri=http%3A%2F%2Fwww.tablehub.cn%2FgdCallback.html&' +
            'response_type=code&' +
            'client_id=590141428668-nibaa0dtep92f89umnepae9cv9b68goa.apps.googleusercontent.com';
        window.open(href);
    }

    oauthSignIn();

//    function makeApiCall() {
//        gapi.client.load('drive', 'v2', function() {
//            var request = gapi.client.drive.files.list({'maxResults': 5});
//            request.execute(function(resp) {
//                console.log('+++++获取文件+++++');
//                console.log(resp.files);
//            });
//        });
//    }
//
//    gapi.client.init({
//        'apiKey': 'AIzaSyDNSbpU8zFmijvbIuLTdSEhRPHXbnRou-s',
//        'clientId': '590141428668-nibaa0dtep92f89umnepae9cv9b68goa.apps.googleusercontent.com',
//        'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
//        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
//    }).then(function() {
//        console.log('111111');
//        GoogleAuth = gapi.auth2.getAuthInstance();
//        GoogleAuth.isSignedIn.listen((isSignedIn) => {
//            console.log('-----isSignedIn-----');
//            console.log(isSignedIn);
//            console.log(GoogleAuth);
//            if(isSignedIn) {
//                makeApiCall();
//            }
//        });
//        GoogleAuth.signIn();
//    });
};
//gapi.load('client', start);