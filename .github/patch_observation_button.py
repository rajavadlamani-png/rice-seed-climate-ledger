from pathlib import Path

index = Path('index.html')
s = index.read_text(encoding='utf-8')
tag = '<script src="./anvora-observation-button-fix.js"></script>'
if tag in s:
    print('observation button script already linked')
    raise SystemExit(0)
marker = '</html>'
pos = s.rfind(marker)
if pos < 0:
    raise SystemExit('final </html> not found')
s = s[:pos] + tag + '\n' + s[pos:]
index.write_text(s, encoding='utf-8')
print('linked observation button fix at final </html>')
