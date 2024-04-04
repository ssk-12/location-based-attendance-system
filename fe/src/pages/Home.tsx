// src/components/Home.tsx
import React, { useEffect } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { classesAtom, fetchClassesSelector } from '../state/classes';

export const Home: React.FC = () => {
    const classesLoadable = useRecoilValueLoadable(fetchClassesSelector);
    const setClasses = useSetRecoilState(classesAtom);
  
    useEffect(() => {
      if (classesLoadable.state === 'hasValue') {
        setClasses(classesLoadable.contents); // Update classesAtom with the fetched data
      }
    }, [classesLoadable, setClasses]);

  switch (classesLoadable.state) {
    case 'hasValue':
      return (
        <div>
          <h2>All Classes</h2>
          <ul>
            {classesLoadable.contents.map((cls) => (
              <li key={cls.id}>{cls.name} - {cls.subject} - Host ID: {cls.hostId}</li>
            ))}
          </ul>
        </div>
      );
    case 'loading':
      return <div>Loading...</div>;
    case 'hasError':
      throw classesLoadable.contents; // You can customize error handling
    default:
      return null; // Or handle the 'hasError' state more gracefully
  }
};
