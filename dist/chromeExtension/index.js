let message = 'Error: dist/chromeExtension/index.js is not built, '
message += 'execute "deno run --allow-env --allow-read --allow-write --allow-run build.run.ts" or '
message += '"deno run -A build.run.ts" in the root of the project to build it.'
console.error(message)
alert(message)
document.body.innerHTML += message