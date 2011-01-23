default :
	upload.py -vfs

folders :
	upload.py -vs

test :
	python2.6 uploadtests.py

profile :
	python2.6 -m cProfile -s cumulative uploadtests.py
