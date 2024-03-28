export function renderHtml(content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>TestUI</title>
        </head>
        <body>
            <div align="center">
                <p>${content}</p>
            </div>
        </body>
    </html>`
}
