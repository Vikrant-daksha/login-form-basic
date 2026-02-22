import {useDroppable} from '@dnd-kit/react';

function Droppable({id, children}) {
  const {ref} = useDroppable({
    id,
  });

  return (
    <div ref={ref} className={'h-6 w-3xs border border-solid'}>
      {children}
    </div>
  );
}

export default Droppable;