import React from 'react';

// Styles
import styles from './ContentSidebar.css';


const Sidebar = (props) => {
  return (
    <aside className={styles.contentSidebar + ' layout-column flex'}>
      { props.children }
    </aside>
  );
};

export default Sidebar
