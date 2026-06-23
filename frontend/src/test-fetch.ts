async function main() {
  const urls = [
    'http://localhost:5000/api/users/auth',
    'http://127.0.0.1:5000/api/users/auth'
  ];

  for (const url of urls) {
    console.log(`Testing fetch to ${url}...`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginType: 'student',
          rollNumber: 'HM10103',
          phone: '9655258556'
        })
      });
      console.log(`Result for ${url}: status = ${res.status}`);
      const data = await res.json();
      console.log(`Response:`, data);
    } catch (err: any) {
      console.error(`Error fetching ${url}:`, err.message);
    }
  }
}

main();
