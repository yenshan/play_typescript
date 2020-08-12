function absentVowel(x: string) {
    const vs = {
        A: 0,
        E: 1,
        I: 2,
        O: 3,
        U: 4,
    };
    let res = [false, false, false, false, false];
    x.split("").map((x) => {
        let xi = x.toUpperCase();
        if ("AEIOU".includes(xi)) {
            res[vs[xi]] = true;
        }
    });
    return res.findIndex((e) => e == false);
}

let r = absentVowel("John Doe hs seven red pples under his bsket");
console.log(r);
