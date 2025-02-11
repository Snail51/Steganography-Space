# Purpose
 - Webapp to hide data/text in the spaces of text documents.
 - Created in the spring of 2024 by Brendan Rood, Jet Li, and Connor Hagen.
 - Created for the class project for Advanced Computer Security at the University of Minnesota Duluth (CS-5732).

# Installation
 - Can run in any dedicated httpx runtime with JS.
 - **Already set up at:** https://tools.snailien.net/TurtleGang/Steganospace/

# Thought Process Behind The Program
 - Large text documents (such as a text file of the entire bible) contain many spaces
 - UNICODE specifies many different "space characters". Despite appearing very similar to the naked eye, to the computer they are completely different.
 - If we could replace the spaces in a text document with other space characters that look the same but aren't in a regular way, we could encode arbitrary data!

# How it Works
 1. User provides a "Cover" `.txt` document.
 2. User provides a "Message" file they want to encode.
 3. There is a hard-coded array of 8 "space" characters.
 4. Message is converted to bytes.
 5. Bytes are compressed with ZLIB compression via the [pako JS library](https://github.com/nodeca/pako).
 6. These resultant bytes are laid out as a binary string.
 7. This binary string is chunked as Octal (base-8).
 8. For every space in the Cover, it is replaced with the space character from the array at the index specified by the Octal value.
 9. If there are more spaces in the Cover after the Message has been fully encoded, all remaining spaces remain as basic spaces.
 - Decoding is the same steps but in reverse.
 - Filetype and Name are also stored as data appended to the end of the payload.

# Space Characters
 - We identified 11 suitable "space" characters in UNICODE, but only ended up using 8 of them.
 0.  U+0020 (Generic Space)
 1.  U+00A0 (Non-Breaking Space)
 2.  U+2000 (EN Quad Space)
 3.  U+2002 (EN Space)
 4.  U+2004 (1/3 EM Space)
 5.  U+2005 (1/4 EM Space)
 6.  U+2006 (1/6 EM Space)
 7.  U+2008 (Punctuation Space)
 8.  U+2009 (Thin Space) [Unused in Octal Implementation]
 9.  U+202F (Narrow No-Break Space) [Unused in Octal Implementation]
 10. U+205F (Medium Mathematical Space) [Unused in Octal Implementation]

# Acknowledgements
 - This program was created with inspiration by the work of April Seliger on the same class project when she took CS-5732 some years prior. In her work, she made a program that encoded data into text by inserting a zero-width-space between every set of characters. The presence of this zero-width-space encoded a 1, the absence encoded a 0.
 - We felt this solution was less than ideal because it meant that holding an arrow key to "scrub" through text would cause the cursor to pause and jerk as it iterated over invisible characters. It would also increase the filesize of the Cover because it is adding rather than replacing characters.