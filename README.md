#{Convolute}
### A web-based Discrete-Time Convolution Demo.

Signals and Systems can be fun; but unless you fully understand what the 
convolution is, things can be quite frustrating!  

This is a web-app I made that demonstrates convolutions in real time.  You
are able to take any two functions and do a discrete-time convolution operation
on them.  Through this process I hope whose of you who are confused will derive
a more intuitive understanding of what it is, how it's values are derived,
and hopefully just how interesting it can be. :P

#### Currently the program supports:
- convoluting predefined functions.
- edit existing functions and save changes.
- easily usable graph space (zoom in, zoom out, move around, etc)
- You can currently only make one new function due to incomplete implementation of function naming parameters. 


#### Next steps on my todo list for this app:
- animate convolution process.
- convolution algorithm optimization:

...The current function used to convolute two functions is slow because it was
...meant to be a quick hand-waving solution with computational complexity of 
...O(n^2).  It can easily be changed to a O(n) algorithm by taking into account
...the finite differences between each step of increase in N.  

- make multiple (more than one) custom functions work.
- add a button to save the result of a convolution as a new function.
- error checking. (right now the editor assumes the user will not try to mess it up)


#### Others?:
- multiple browser support.
- other things I can’t get off the top of my head.


--------------------------

### Credits and Thanks:

This web-app's HTML framework is based on Evan Wallace's Web-GL Filters app.
I did not think one would be capable of achieving such elegance in  web-apps
before stumbling upon the works of Evan Wallace.  He is an inspiration.

The editor I used is the ACE editor. You can find them here: http://ace.c9.io/

The graphing utilies I used is by Dygraph: http://dygraphs.com/



LICENCE
-------
```
Copyright (C) 2011 by Daniel Gen Li 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
