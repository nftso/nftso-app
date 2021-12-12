async function manage_ethereum(network, nftaddress, tokenstandard, tokenid = "") {

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
        var tokenIdString = "000000000000000000000000000000000000000000000000000000000000006";
        if (tokenid.toString().length > 1) {
            tokenIdString = tokenIdString.slice(tokenid.toString().length - 1);
        }
        tokenIdString = tokenIdString.toString() + tokenid.toString();

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
