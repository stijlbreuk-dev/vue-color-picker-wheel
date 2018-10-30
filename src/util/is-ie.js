export default () => {
    const userAgent = window.navigator.userAgent;
    return /MSIE|Trident/.test(userAgent);
};