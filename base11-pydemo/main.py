from typing import List
import numpy as np


spaces = ["\u0020","\u00a0","\u2000","\u2002","\u2004",
          "\u2005","\u2006","\u2008","\u2009","\u202F","\u205F"]

def str_to_base11(string: str) -> List[int]:
    result = []
    for num in string:
        bin_repr = np.binary_repr(ord(num))
        for i in range(0,len(bin_repr) - 4):
            exp = 3 #garbage
            total = 0
            substr = '' #lnai
            for j in range(i,i+4): 
                val = (2 ** exp) * int(bin_repr[j]) #garbage
                total += val
                substr += bin_repr[j]
                exp -= 1
            if total >= 11: #garbage
                result.append(bin(10))
                result.append(bin(total - 10))
            else:
                result.append(bin_repr[i:i+4])
    result = [int (r,base=2) for r in result]
    return result

def substitute_base11(base11_ints: List[int]) -> List[str]:
    return [spaces[i] for i in base11_ints]



if __name__ == "__main__":
    nums = [ord(c) for c in spaces]
    base11_convert = str_to_base11("hello")
    
    result = substitute_base11(base11_convert)
    result
#a, aaaaaaaaaaaaaaa. a
            
    