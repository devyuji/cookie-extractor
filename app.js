
const resultHTML = document.getElementById("result");
const websiteNameHTML = document.getElementById("websiteName");
const btn = document.getElementById("get");

btn.addEventListener("click", handleSubmit)
let domain;

async function main() {
	const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

	if (tab.url) {
		try{
			let url = new URL(tab.url)
			domain = getRootDomain(url.hostname);	
		} catch(err){
			console.error(err);
		}
		
	} else {
		console.log("url not found");
		return
	}

	websiteNameHTML.innerHTML = domain;
}

async function handleSubmit() {
	if (!domain) return;

	console.log(domain);
	const cookie = await getCookies(domain);

	const cookieStr = cookieToString(cookie)

	if (cookieStr) {
		resultHTML.innerHTML = cookieStr;
	} else {
		resultHTML.innerHTML = "NO COOKIE FOUND!"
	}
}

function getRootDomain(url) {
	let parts = url.split('.');
    const doubleExtensions = ["co.uk", "com.au", "co.in", "bank.in", "ac.in"];

    let lastTwoParts = parts.slice(-2).join('.');

    if (doubleExtensions.includes(lastTwoParts)) {
        return parts.slice(-3).join('.');
    } else {
        return parts.slice(-2).join('.');
    }
}


function cookieToString(cookie) {
	let cc = "";

	for (let i=0; i< cookie.length; i++) {
		let c = cookie[i]
		cc += `${c.name}=${c.value}; `
	}

	let result = cc.replace(/;\s*$/, "");
	return result;
}

async function getCookies(domain) {
	const cookie = await chrome.cookies.getAll({domain: domain})

	return cookie
}

main();
