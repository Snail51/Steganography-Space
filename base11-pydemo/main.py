from typing import List
import numpy as np

SPACES = ["\u0020","\u00a0","\u2000","\u2002","\u2004",
          "\u2005","\u2006","\u2008","\u2009","\u202F","\u205F"]

def str_to_base11(string: str) -> List[int]:
    result = []
    for char in string:
        bin_repr = np.binary_repr(ord(char))
        i = 0
        while i < (len(bin_repr) - 4):
            substr = bin_repr[i : i+4]
            ordinal = int(substr, base=2)
            if ordinal >= 11: 
                result += [bin(10),bin(ordinal-10)]
            else:
                result.append(substr)
            i += 4
        remainder = ''
        while i < len(bin_repr):
            remainder += bin_repr[i]
            i += 1
        remainder += '0'
    return [int(r,base=2) for r in result]

def substitute_base11(base11_ints: List[int]) -> List[str]:
    return [SPACES[i] for i in base11_ints]

if __name__ == "__main__":
    base11_convert = str_to_base11("hello")
    print(base11_convert)
    result = substitute_base11(base11_convert)
    result
#a, aaaaaaaaaaaaaaa. a
            
    