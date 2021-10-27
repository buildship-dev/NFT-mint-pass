export const web3 = window.ethereum ? new Web3(ethereum) : undefined;

const isMetamaskConnected = async () => {
    if (window.ethereum && isMobile()) {
        await ethereum.request({ method: 'eth_requestAccounts' });
    }
    return window.ethereum && ethereum?.selectedAddress !== null;
}

export const getWalletAddress = async () => {
    const currentAddress = async () => {
        if (!window.ethereum) {
            return undefined;
        }
        return ethereum?.selectedAddress ?? await ethereum.request({ method: 'eth_requestAccounts' })[0];
    }
    if (!await currentAddress()) {
        await connectMetamask();
    }
    return await currentAddress();
}

export const getCurrentNetwork = async () => {
    return Number(await ethereum.request({ method: 'net_version' }));
}

export const updateMetamaskStatus = async () => {
    const connected = await isMetamaskConnected()
    if (connected) {
        const button = document.querySelector(window.buttonID ?? '#connect');
        button.textContent = "Metamask connected";
    }
}

const getIsMobile = () => (/Mobi/i.test(window.navigator.userAgent)
    || /iPhone|iPod|iPad/i.test(navigator.userAgent));

export const connectMetamask = async () => {
    const isMobile = getIsMobile();
    if (window.ethereum) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        await updateMetamaskStatus();
    } else if (isMobile) {
        const link = window.location.href
            .replace("https://", "")
            .replace("www.", "");
        window.open(`https://metamask.app.link/dapp/${link}`);
    }
}

document.querySelector(window.buttonID ?? '#connect').addEventListener('click', connectMetamask);
await updateMetamaskStatus();
