import { RefObject, useEffect } from 'react';

export function useClickOutside(ref: RefObject<any>, cb?: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    console.log(ref.current);

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (cb) cb();
        else console.log('You clicked outside of me!');
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
