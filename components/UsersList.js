import React from 'react';

import ProfilePhoto from './ProfilePhoto';

export default ({users=[], size}) => (
  <div className='UsersList'>
    {users.map(({id, avatar, name}) => {
      return (
        <div className='UsersList-item' key={id}>
          <ProfilePhoto
            url={avatar}
            size={size}
            hasBorder={true} />
          <div className='UsersList-name'>{name}</div>
        </div>
      );
    })}
  </div>
);