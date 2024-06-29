# may need to install pillow img ext.
# pip install --upgrade Pillow

from PIL import Image, ImageDraw
import struct

def dumpPal():
	i = 0
	x = 0
	y = 0
	im = Image.new('RGB', (16, 16), (255, 255, 255))
	draw = ImageDraw.Draw(im)
	while (i<256):
		p = i * 3
		r = pal[p]
		g = pal[p + 1]
		b = pal[p + 2]
		#print("r: "+str(r)+", g: "+str(g)+", b: "+str(b))
		draw.rectangle((x, y, x+1, y+1), fill=(r, g, b))
		x += 1
		if (x > 16):
			x = 0
			y += 1
		i += 1
	s = "pal/" + str(fnum) + '_Pal.png'
	im.save(s, quality=100)

def doRLE(imgSize, width):
	x = 0
	y = 0
	print("imgSize: "+str(imgSize))
	while ((x * y) < imgSize):
		repeat = struct.unpack('<B', f.read(1))[0]
		color = struct.unpack('<B', f.read(1))[0]
		#print("repeat: "+str(repeat)+", color: "+str(color))
		p = color * 3
		r = pal[p]
		g = pal[p + 1]
		b = pal[p + 2]
		#print ("r: " + str(r) + ", g: " + str(g) + ", b: " + str(b))
		i = 0
		while (i < repeat):
			draw.rectangle((x, y, x+1, y+1), fill=(r, g, b))
			i += 1
			x += 1
			if (x > width):
				x = 0
				y += 1


def doReg(width, height):
	y = 0
	while (y < height):
		x = 0
		while (x < width):
			color = struct.unpack('<B', f.read(1))[0]
			#print("color: "+str(color))
			p = color * 3
			r = pal[p]
			g = pal[p + 1]
			b = pal[p + 2]
			draw.rectangle((x, y, x+1, y+1), fill=(r, g, b))
			x += 1
		y += 1

fnum = 0
with open("resource.vol", "rb") as f:
	while (byte := f.read(1)):
		if (byte == b'\x74' and f.read(1) == b'\x65' and f.read(1) == b'\x78' and
	  		f.read(1) == b'\x20' and f.read(1) == b'\x30' and f.read(1) == b'\x30' and 
			f.read(1) == b'\x30' and f.read(1) == b'\x31'):
			print("Found tex 0001, fnum: " + str(fnum) + " starting at: " + str(f.tell()-8))
			i = 0
			pal = []
			while (i<768):
				c = struct.unpack('<B', f.read(1))[0]
				pal.append(c)
				i += 1
			#dumpPal()
			unknown = f.read(4)
			#print("unknown: " + str(unknown))
			width = struct.unpack('<H', f.read(2))[0]
			height = struct.unpack('<H', f.read(2))[0]
			print("width: " + str(width) + ", height: " + str(height))
			imgSize = width * height
			im = Image.new('RGB', (width, height), (255, 255, 255))
			draw = ImageDraw.Draw(im)
			f.read(8)

			doRLE(imgSize, width)
			#doReg(width, height)

			s = "img/" + str(fnum) + '.png'
			im.save(s, quality=95)
			fnum += 1
			print("stopped at: " + str(f.tell()))