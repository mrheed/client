
interface CookieInformation {
    Name: string;
    Value: string;
    Expires: string | Date;
    Path: string;
}

export function SelectCookie(CookieName: string) {
    return document.cookie.split(";").filter(x => x.trim().includes(CookieName + "=")).map(x => x.trim().split("=").pop())
}

export function DeleteCookie(CookieName: string[], path: string[]) {
    return CookieName.map(x => path.map(a => document.cookie = x + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT; path=" + a + ";"))
}

export function SetCookies(CookieInformation: CookieInformation) {
    return document.cookie = `${CookieInformation.Name}=${CookieInformation.Value}; expires=${CookieInformation.Expires}; path=${CookieInformation.Path}`;
}

export function CheckPath(Pathname: string) {
    var splitted = Pathname.split("/")!; splitted.shift(); if (splitted.length === 1) return "/"; return "/" + splitted[splitted.length-2];
}

export function checkCookieValue(CookieName: string) {
    return SelectCookie(CookieName).length === 0 || SelectCookie(CookieName)[0] === "" || SelectCookie(CookieName)[0] === undefined ? false : true
}

export function hexToRgbA(hex: any, alpha: number){
    var c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c = hex.substring(1).split('');
        if(c.length == 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    throw new Error('Bad Hex');
  }