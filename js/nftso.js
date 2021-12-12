async function NftsoInit(network, nftaddress, tokenstandard, tokenid = "") {

    if (typeof window['ethereum'] === 'undefined') {
        alert("MetaMask is not installed!");
        return false;
    }

    const verify_btn = document.getElementById('verify_btn');
    var defaultBtnText = verify_btn.innerText;
    try {
        if(defaultBtnText.includes(' ❌')) {
            defaultBtnText = defaultBtnText.replace(' ❌', '');
        }
        if(defaultBtnText.includes(' ✔️')) {
            defaultBtnText = defaultBtnText.replace(' ✔️', '');
        }
        verify_btn.innerHTML = defaultBtnText + '<div id=\'verify_btn_loader\'></div>';
    } catch(e) {
    }

    const accounts = await window["ethereum"].request({
        method: "eth_requestAccounts",
    });
    const account = accounts[0];
    var userAccount = account.replace('0x', '');

    var body;

    if (tokenstandard === "erc721") {
        body = {
            jsonrpc: "2.0",
            id: 4,
            method: "eth_call",
            params: [
                {
                    from: "0x0000000000000000000000000000000000000000",
                    data: "0x70a08231000000000000000000000000" + userAccount,
                    to: nftaddress,
                },
                "latest",
            ],
        };
    } else {
        var tokenIdString = decToHex(tokenid);
        // if (tokenid.toString().length > 1) {
        //     tokenIdString = tokenIdString.slice(tokenid.toString().length - 1);
        // }
        // tokenIdString = tokenIdString.toString() + tokenid.toString();

        body = {
            jsonrpc: "2.0",
            id: 4,
            method: "eth_call",
            params: [
                {
                    from: "0x0000000000000000000000000000000000000000",
                    data: "0x00fdd58e000000000000000000000000" + userAccount + tokenIdString,
                    to: nftaddress,
                },
                "latest",
            ],
        };
    }

    const response = await fetch("https://polygon-rpc.com", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const myJson = await response.json();

    try {
        if(defaultBtnText.includes(' ❌')) {
            defaultBtnText = defaultBtnText.replace(' ❌', '');
        }
        if(defaultBtnText.includes(' ✔️')) {
            defaultBtnText = defaultBtnText.replace(' ✔️', '');
        }
    } catch(e) {}

    if (myJson.result === "0x0000000000000000000000000000000000000000000000000000000000000000") {
        // NO OWN
        verify_btn.innerHTML = defaultBtnText + ' ❌';
        return false;
    } else {
        verify_btn.innerHTML = defaultBtnText + ' ✔️';
    }
    return true;
}

function decToHex(decStr) {
    var hex = convertBase(decStr, 10, 16);
    return hex ? hex : null;
}

function convertBase(str, fromBase, toBase) {
    var digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;

    var outArray = [];
    var power = [1];
    for (var i = 0; i < digits.length; i++) {
        // invariant: at this point, fromBase^i = power
        if (digits[i]) {
        outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = multiplyByNumber(fromBase, power, toBase);
    }

    var out = '';
    for (var i = outArray.length - 1; i >= 0; i--) {
        out += outArray[i].toString(toBase);
    }
    return out;
}

function parseToDigitsArray(str, base) {
    var digits = str.split('');
    var ary = [];
    for (var i = digits.length - 1; i >= 0; i--) {
        var n = parseInt(digits[i], base);
        if (isNaN(n)) return null;
        ary.push(n);
    }
    return ary;
}

function add(x, y, base) {
    var z = [];
    var n = Math.max(x.length, y.length);
    var carry = 0;
    var i = 0;
    while (i < n || carry) {
        var xi = i < x.length ? x[i] : 0;
        var yi = i < y.length ? y[i] : 0;
        var zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
    }
    return z;
}

function multiplyByNumber(num, x, base) {
    if (num < 0) return null;
    if (num == 0) return [];

    var result = [];
    var power = x;
    while (true) {
        if (num & 1) {
        result = add(result, power, base);
        }
        num = num >> 1;
        if (num === 0) break;
        power = add(power, power, base);
    }

    return result;
}