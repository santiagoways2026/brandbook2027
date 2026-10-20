import sys
from PIL import ImageFont
import os
F=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts', 'Montserrat-%s.ttf')
w, pt, text = sys.argv[1], float(sys.argv[2]), sys.argv[3]
f = ImageFont.truetype(F % w, 1000)
print(f.getlength(text) / 1000 * pt / 72)
