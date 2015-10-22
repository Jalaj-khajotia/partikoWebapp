'use strict';

angular.module('sbAdminApp')

.factory('EventsService',
    ['$http', '$rootScope', '$timeout','Base64',
    function ( $http, $rootScope, $timeout, Base64) {
        var service = {};
//'eyJrZXkiOiIwY2NhMWI1OWI0NjA1ZDU3In0.CQa6dA.BCTl2PTbykDdrgG_qUEvru2-HR0';//  
             var authdata = sessionStorage.getItem('token');
             var encodedData = btoa(authdata + ":partiko");
             $http.defaults.headers.common['Content-Type'] = 'application/json';   
             $http.defaults.headers.common['Authorization'] ='Basic ' + encodedData;
            
        service.GetEvents = function (callback) {

            return $http.post('http://web.partiko.com/merchant/events', {"offset":0})
               .then( function (response) {
                  // console.log(response.data.events);
                   callback(response);
                   return response;
               },function (error) {
                    var data = error.data;
                    return error;
                    // not relevant
                  });

        };

        service.DeleteEvent = function(eventkey){
        // change to http://web.partiko.com/merchant/event
        console.log('eventkey: '+ eventkey);
        var req = {
                     method: 'DELETE',
                     url: 'http://api.partiko.com/merchant/event',
                      data: { event_key: eventkey}
                    };
             /* var deletejson = JSON.parse('{"event_key" :'+ eventkey+'}');*/
           return $http(req)
           .then(function(response){
            return response;
           }, function(error){
              return error;
           });

          /*  return $http.delete('http://api.partiko.com/merchant/event', deletejson)
                .then(function(response){
                     return response;
                 },function(error){
                    return error;
                 });
*/
        };

        service.EditEvents = function(event){
            console.log(event);
             return $http.put('http://web.partiko.com/merchant/event',event)
                .then(function(response){
                     return response;
                 },function(error){
                    return error;
                 });
        };

         service.AddEvents = function (event) {

             $http.post('http://web.partiko.com/merchant/event', event)
               .success(function (response) {
                  //console.log(response);
                   return response;
                   callback();
               }).error(function(error){
               // failure();
               console.log(error);
               });

         };
        return service;
    }])

.factory('Base64', function() {

    // private property
    var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    // private method for UTF-8 encoding
    var _utf8_encode = function(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';

        for (var n = 0; n < string.length; n += 1) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    // private method for UTF-8 decoding
    var _utf8_decode = function(utftext) {
        var string = '';
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i += 1;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    };

    return {
        // public method for encoding
        encode: function(input) {
            var output = '';
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = _utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i += 1);
                chr2 = input.charCodeAt(i += 1);
                chr3 = input.charCodeAt(i += 1);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function(input) {
            var output = '';
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

            while (i < input.length) {

                /* jshint ignore:start */

                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));

                /* jshint ignore:end */

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);


                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = _utf8_decode(output);

            return output;
        }
    };
});