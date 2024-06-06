# Extract wav files from Larry's Casino audio.vol
# jokes are 71.wav - 183.wav

import struct
fnum = 0

with open("audio.vol", "rb") as f:
	while (byte := f.read(1)):
		if byte == b'\x52' and f.read(1) == b'\x49' and f.read(1) == b'\x46' and f.read(1) == b'\x46':
			print("Found RIFF starting at: ", f.tell())
			s = struct.unpack('<i', f.read(4))[0]
			print("wav size: ", s)
			f.seek(-8, 1)
			wav = f.read(s+8)
			str1 = str(fnum)  + ".wav"
			fnum=fnum+1
			nf = open(str1, 'bw+')
			nf.write(wav)
			nf.close()


