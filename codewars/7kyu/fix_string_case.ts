



export function solve(s: string) {
    let sArray = s.split("");
    let upperCaseCount = sArray.filter((e) => { return e === e.toUpperCase() }).length;
    let lowerCaseCount = s.length - upperCaseCount;

    console.log(upperCaseCount);

    if (upperCaseCount > lowerCaseCount) {
        return s.toUpperCase();
    } else {
        return s.toLowerCase();
    }
}


console.log(solve("aaABBB"));
