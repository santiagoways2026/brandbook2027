# Incrusta Montserrat (Regular, Bold, ExtraBold) en el .docx y, opcionalmente, lo convierte en .dotx
import sys, zipfile, uuid, re, os

src, out = sys.argv[1], sys.argv[2]
dotx = out.endswith('.dotx')
FD = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts')

EMB = [  # (familia, tipo de incrustación, archivo)
    ('Montserrat', 'embedRegular', 'Montserrat-400.ttf'),
    ('Montserrat', 'embedBold', 'Montserrat-700.ttf'),
    ('Montserrat ExtraBold', 'embedRegular', 'Montserrat-800.ttf'),
]


def obfuscate(data, guid):
    key = bytes.fromhex(guid.replace('-', ''))[::-1]
    b = bytearray(data)
    for i in range(32):
        b[i] ^= key[i % 16]
    return bytes(b)


zin = zipfile.ZipFile(src)
files = {n: zin.read(n) for n in zin.namelist()}

rels, parts, fonts = [], {}, {}
for i, (fam, kind, fn) in enumerate(EMB, 1):
    g = str(uuid.uuid4()).upper()
    rid = f'rIdF{i}'
    parts[f'word/fonts/font{i}.odttf'] = obfuscate(open(os.path.join(FD, fn), 'rb').read(), g)
    rels.append(f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font{i}.odttf"/>')
    fonts.setdefault(fam, []).append(f'<w:{kind} r:id="{rid}" w:fontKey="{{{g}}}"/>')

ft = files['word/fontTable.xml'].decode()
head = re.match(r'(<\?xml[^>]*\?>\s*<w:fonts[^>]*?)(/?)>', ft)
font_xml = ''.join(
    f'<w:font w:name="{fam}"><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/>{"".join(e)}</w:font>'
    for fam, e in fonts.items()
) + '<w:font w:name="Arial"><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>'
files['word/fontTable.xml'] = (head.group(1) + '>' + font_xml + '</w:fonts>').encode()
files['word/_rels/fontTable.xml.rels'] = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + ''.join(rels) + '</Relationships>').encode()
files.update(parts)

st = files['word/settings.xml'].decode()
if '<w:displayBackgroundShape/>' in st:
    st = st.replace('<w:displayBackgroundShape/>', '<w:displayBackgroundShape/><w:embedTrueTypeFonts/>', 1)
else:
    st = re.sub(r'(<w:settings[^>]*>)', r'\1<w:embedTrueTypeFonts/>', st, count=1)
files['word/settings.xml'] = st.encode()

ct = files['[Content_Types].xml'].decode()
if 'odttf' not in ct:
    ct = ct.replace('<Default ', '<Default ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont" Extension="odttf"/><Default ', 1)
if dotx:
    ct = ct.replace('wordprocessingml.document.main+xml', 'wordprocessingml.template.main+xml')
files['[Content_Types].xml'] = ct.encode()

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    order = ['[Content_Types].xml'] + [n for n in files if n != '[Content_Types].xml']
    for n in order:
        z.writestr(n, files[n])
print('ok', out, os.path.getsize(out))
