// src/app/components/shared/ui/tabs.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { ReactElement, useEffect, useState } from 'react';

type TabProps = {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export const Tab: React.FC<TabProps> = ({ children }) => <>{children}</>;

type TabsProps = {
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
};

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [active, setActive] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab');

  const childrenArray = Array.isArray(children) ? children : [children];

  useEffect(() => {
    if (!tab) return;
    const index = childrenArray.findIndex(child => child.key === tab);
    if (index >= 0) {
      setActive(index);
    }
  }, [tab]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    cb?: () => void
  ) => {
    e.preventDefault();

    const selectedKey = childrenArray[index].key as string;
    const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
    newSearchParams.set('tab', selectedKey);

    router.push(`?${newSearchParams.toString()}`);
    setActive(index);
    cb?.();
  };

  return (
    <div className="tabs">
      <div className="tabs__navigation">
        {childrenArray.map((child, index) => (
          <a
            href="#"
            key={child.key}
            className={`tabs__navigation__item ${index === active ? 'active' : ''}`}
            onClick={e => handleClick(e, index, child.props.onClick)}
          >
            {child.props.title}
          </a>
        ))}
      </div>
      <div className="tabs__body">{childrenArray[active]}</div>
    </div>
  );
};
