/**
 * Created by michael on 11/8/14.
 */

// Create the encryption object and set the key.
var crypt = new JSEncrypt();

crypt.setKey(__YOUR_OPENSSL_PRIVATE_OR_PUBLIC_KEY__); //You can use also setPrivateKey and setPublicKey, they are both alias to setKey

//Eventhough the methods are called setPublicKey and setPrivateKey, remember
//that they are only alias to setKey, so you can pass them both a private or
//a public openssl key, just remember that setting a public key allows you to only encrypt.

var text = 'test';
// Encrypt the data with the public key.
var enc = crypt.encrypt(text);
// Now decrypt the crypted text with the private key.
var dec = crypt.decrypt(enc);

// Now a simple check to see if the round-trip worked.
if (dec === text){
    alert('It works!!!');
} else {
    alert('Something went wrong....');
}