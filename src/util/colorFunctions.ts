

export function VBColorToHEX(i: number) {
    var bbggrr =  ("000000" + i.toString(16)).slice(-6);
    var rrggbb = bbggrr.substr(0, 2) + bbggrr.substr(2, 2) + bbggrr.substr(4, 2);
    return "#" + rrggbb;
}
export function HEXToVBColor(rrggbb: string) {
    var bbggrr = rrggbb.substr(1, 2) + rrggbb.substr(3, 2) + rrggbb.substr(5, 2);
    return parseInt(bbggrr, 16);
}