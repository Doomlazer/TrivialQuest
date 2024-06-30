# may need to install pillow img ext.
# pip install --upgrade Pillow
# Requires a font named SQ3n001.ttf at script root
# Requires folders named 'img' and 'pal' at script root
# Requires LC's RESOURCES.VOL at script root

from PIL import Image, ImageFont, ImageDraw
import struct

def exportPalImg():
	i = 0
	x = 0
	y = 0
	scale = 100
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

def check4OverRun(data):
	l = len(data) - 1
	while (l > 0):
		pos += 1
		if (data[l] == "t"):
			if (len(data) > l + 7):
				if (data[l+1] == "e" and data[l+2] == "x" and data[l+3] == " " and 
					data[l+4] == "0" and data[l+5] == "0" and data[l+6] == "0" and 
					data[l+7] == "1"):
					#print("l: "+ str(l))
					print("===DATA OVERRUN, matched tex 0 === at:" + str(pos))
		l -= 1

def countConsecutive(data):
	max = 0
	p = 0
	cur = 0
	last = 0
	i = len(data) - 1
	while (i > 0):
		if (data[i] == last):
			cur += 1
		else:
			if (cur > max):
				max = cur
				p = last
				print("string of " + str(max) + " " + str(p))
			cur = 0
		last = data[i]	
		i -= 1
	print(str(max) + " consecutive " + str(p) + " pixels in img data.")

def decodeRLE(imgSize, width):
	x = 0
	y = 0
	data = []
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
			draw.rectangle((x*iScale, y*iScale, x*iScale+iScale, y*iScale+iScale), fill=(r, g, b))
			draw.text((x*iScale, y*iScale), str(color), (255,255,255), font=font) # add pal number white
			draw.text((x*iScale, y*iScale+15), str(color), (0,0,0), font=font) # black
			data.append(color)
			i += 1
			x += 1
			if (x > width):
				x = 0
				y += 1
	#Print("decodeRLE image data:")
	#print(data)
	#check4OverRun(data)


def noDecoding(width, height):
	y = 0
	data = []
	while (y < height):
		x = 0
		while (x < width):
			color = struct.unpack('<B', f.read(1))[0]
			# Compressed alpha testing
			if (color == "disabled"): # set color == [alpha color]
				repeat = struct.unpack('<B', f.read(1))[0]
				print("color: "+str(color)+" repeating: "+str(repeat)+" data.len: "+str(len(data)))
				while (repeat > 0):
					repeat -= 1
					data.append(int(color))
					drawPixel(color,x,y)
					x += 1
					if (x >= width):
						x = 0
						y += 1
			else:
				#print("Single color: "+str(color))
				data.append(int(color))
				drawPixel(color,x,y)
				x += 1
		y += 1
	countConsecutive(data)
	#print("noDecoding image data:")
	#print(data)
	#check4OverRun(data)
	

def drawPixel(color, x, y):
	p = color * 3
	r = pal[p]
	g = pal[p + 1]
	b = pal[p + 2]
	draw.rectangle((x*iScale, y*iScale, x*iScale+iScale, y*iScale+iScale), fill=(r, g, b))
	# draw palette number on pixel. Very slow, debug only
	draw.text((x*iScale, y*iScale), str(color), (255,255,255), font=font) # add pal number white
	draw.text((x*iScale, y*iScale+15), str(color), (0,0,0), font=font) # black

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


fnum = 0
iScale = 40 # large pixels for debugging, use 1 for fast processing
font = ImageFont.truetype("SQ3n001.ttf", 25)
# "463" for testing. Default == "resource.vol"
with open("463", "rb") as f:
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
			im = Image.new('RGB', (width*iScale, height*iScale), (255, 255, 255))
			draw = ImageDraw.Draw(im)
			unknown2 = f.read(8)
			print("Unknown 8 bytes @ 0x310: " + str(unknown2))
			#logUnknown(f) #debugging

			#choose decode method
			#decodeRLE(imgSize, width)
			noDecoding(width, height)

			s = "img/" + str(fnum) + '.png'
			im.save(s, quality=95)
			fnum += 1
			print("stopped reading data at: " + str(f.tell()))