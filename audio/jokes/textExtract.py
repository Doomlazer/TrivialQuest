# may need to install pillow img ext.
# pip install --upgrade Pillow
# Requires a font named SQ3n001.ttf at script root
# Requires folders named 'img' and 'pal' at script root
# Requires LC's RESOURCES.VOL at script root

from PIL import Image, ImageFont, ImageDraw
import struct

def exportPalImg():
	font = ImageFont.truetype("SQ3n001.ttf", 25)
	i = 0
	x = 0
	y = 0
	scale = 70
	im = Image.new('RGB', (16*scale, 16*scale), (255, 255, 255))
	draw = ImageDraw.Draw(im)
	while (i<256):
		p = i * 3
		r = pal[p]
		g = pal[p + 1]
		b = pal[p + 2]
		#print("r: "+str(r)+", g: "+str(g)+", b: "+str(b))
		draw.rectangle((x*scale, y*scale, x*scale+scale, y*scale+scale), fill=(r, g, b))
		draw.text((x*scale, y*scale), str(i), (255,255,255), font=font) # add numbers on top color
		draw.text((x*scale, y*scale+15), str(i), (0,0,0), font=font) # add black for higher contrast
		draw.text((x*scale, y*scale+30), str(r)+" "+str(g)+" "+str(b), (255,255,255), font=font) # RGB white
		draw.text((x*scale, y*scale+45), str(r)+" "+str(g)+" "+str(b), (0,0,0), font=font) # RGB black
		x += 1
		if (x > 16):
			x = 0
			y += 1
		i += 1
	s = "pal/" + str(fnum) + '_Pal.png'
	im.save(s, quality=100)

def decodeRLE(imgSize, width):
	x = 0
	y = 0
	data = []
	start = f.tell()
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
			data.append(color)
			i += 1
			x += 1
			if (x > width):
				x = 0
				y += 1
	#Print("decodeRLE image data:")
	#print(data)
	for d in data:
		if (d == "t"):
			print("Data+1: " + data[v+1])
			print("Data+2: " + data[v+2])
			v = data.index(d)
			if (len(data) > v+7):
				if (data[v+1] == "e" and data[v+2] == "x" and data[v+3] == " " and 
					data[v+4] == "0" and data[v+5] == "0" and data[v+6] == "0" and 
					data[v+7] == "1"):
					print("===DATA OVERRUN, matched tex 0 === at:" + str(start + v))


def noDecoding(width, height):
	y = 0
	data = []
	pos = f.tell()
	while (y < height):
		x = 0
		while (x < width):
			color = struct.unpack('<B', f.read(1))[0]
			data.append(chr(color))
			#print("color: "+str(color))
			p = color * 3
			r = pal[p]
			g = pal[p + 1]
			b = pal[p + 2]
			draw.rectangle((x, y, x+1, y+1), fill=(r, g, b))
			x += 1
		y += 1
	#print("noDecoding image data:")
	#print(data)
	l = len(data) - 1
	while (l > 0):
		pos += 1
		if (data[l] == "t"):
			if (len(data) > l + 7):
				if (data[l+1] == "e" and data[l+2] == "x" and data[l+3] == " " and 
					data[l+4] == "0" and data[l+5] == "0" and data[l+6] == "0" and 
					data[l+7] == "1"):
					print("l: "+ str(l))
					print("===DATA OVERRUN, matched tex 0 === at:" + str(pos+l))
		l -= 1

def logUnknown(f):
	f.seek(-8, 1)
	u2 = struct.unpack('<h', f.read(2))[0]
	u3 = struct.unpack('<h', f.read(2))[0]
	u4 = struct.unpack('<h', f.read(2))[0]
	u5 = struct.unpack('<h', f.read(2))[0]
	print("  bytes @ 0x310 as short: " + str(u2)+" "+str(u3)+" "+str(u4)+" "+str(u5))
	f.seek(-8, 1)
	u2 = struct.unpack('<H', f.read(2))[0]
	u3 = struct.unpack('<H', f.read(2))[0]
	u4 = struct.unpack('<H', f.read(2))[0]
	u5 = struct.unpack('<H', f.read(2))[0]
	print("  bytes @ 0x310 as unsigned short: " + str(u2)+" "+str(u3)+" "+str(u4)+" "+str(u5))
	f.seek(-8, 1)
	u2 = struct.unpack('<b', f.read(1))[0]
	u3 = struct.unpack('<b', f.read(1))[0]
	u4 = struct.unpack('<b', f.read(1))[0]
	u5 = struct.unpack('<b', f.read(1))[0]
	u6 = struct.unpack('<b', f.read(1))[0]
	u7 = struct.unpack('<b', f.read(1))[0]
	u8 = struct.unpack('<b', f.read(1))[0]
	u9 = struct.unpack('<b', f.read(1))[0]
	print("  bytes @ 0x310 as signed char: " + str(u2)+" "+str(u3)+" "+str(u4)+" "+str(u5)+" "+str(u6)+" "+str(u7)+" "+str(u8)+" "+str(u9))
	f.seek(-8, 1)
	u2 = struct.unpack('<B', f.read(1))[0]
	u3 = struct.unpack('<B', f.read(1))[0]
	u4 = struct.unpack('<B', f.read(1))[0]
	u5 = struct.unpack('<B', f.read(1))[0]
	u6 = struct.unpack('<B', f.read(1))[0]
	u7 = struct.unpack('<B', f.read(1))[0]
	u8 = struct.unpack('<B', f.read(1))[0]
	u9 = struct.unpack('<B', f.read(1))[0]
	print("  bytes @ 0x310 as unsigned char: " + str(u2)+" "+str(u3)+" "+str(u4)+" "+str(u5)+" "+str(u6)+" "+str(u7)+" "+str(u8)+" "+str(u9))


fnum = 1
with open("resource.vol", "rb") as f:
	while (byte := f.read(1)):
		if (byte == b'\x74' and f.read(1) == b'\x65' and f.read(1) == b'\x78' and
			f.read(1) == b'\x20' and f.read(1) == b'\x30' and f.read(1) == b'\x30' and 
			f.read(1) == b'\x30' and f.read(1) == b'\x31'):
			print("***********************************")
			print("Found tex 0001, fnum: " + str(fnum) + " starting at: " + str(f.tell()-8))
			i = 0
			pal = []
			while (i<768):
				c = struct.unpack('<B', f.read(1))[0]
				pal.append(c)
				i += 1
			#print("Palette:")
			#print(pal)
			exportPalImg()
			unknown = f.read(4)
			print("Unknown 4 bytes @ 0x308: " + str(unknown))
			width = struct.unpack('<H', f.read(2))[0]
			height = struct.unpack('<H', f.read(2))[0]
			print("Width: " + str(width) + ", Height: " + str(height))
			imgSize = width * height
			im = Image.new('RGB', (width, height), (255, 255, 255))
			draw = ImageDraw.Draw(im)
			unknown2 = f.read(8)
			print("Unknown 8 bytes @ 0x310: " + str(unknown2))
			logUnknown(f) #debugging

			#choose decode method
			#decodeRLE(imgSize, width)
			noDecoding(width, height)

			s = "img/" + str(fnum) + '.png'
			im.save(s, quality=95)
			fnum += 1
			print("stopped reading data at: " + str(f.tell()))