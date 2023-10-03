import React, { useEffect, useState, useRef } from 'react';

import { CloseCircleOutlined } from '@ant-design/icons';
function ListItems(props) {
  const { items, onItemClick, filter, onCancel } = props;
  const [memberList, setMemberList] = useState([]);
  const _isMounted = useRef(false);
  const [membersVisible, setMembersVisible] = useState('hidden');
  useEffect(() => {
    let tempArray = [];
    if (!_isMounted.current) {
      setMembersVisible('hidden');
      _isMounted.current = true;
      return;
    }

    items.map(item => {
      if (
        item.first_name.search(filter) != -1 ||
        item.last_name.search(filter) != -1
      ) {
        tempArray.push(item);
      }
    });
    _isMounted.current = true;
    setMembersVisible('visible');
    filter != '' ? setMemberList(tempArray) : setMemberList([]);
  }, [filter]);
  return (
    <div className="filter-container" style={{ visibility: membersVisible }}>
      <div style={{ padding: '5px' }}>
        <div style={{ float: 'right', padding: '2px' }}>
          <CloseCircleOutlined
            onClick={() => {
              setMembersVisible('hidden');
              onCancel();
              _isMounted.current = false;
            }}
            style={{ fontSize: '22px', cursor: 'pointer' }}
          />
        </div>
        <div style={{ padding: '2px', color: '#8ba722' }}>
          Please select the member:
        </div>
      </div>
      <div>
        {memberList.map((item, index) => {
          return (
            <div
              className="item-container"
              key={index}
              onClick={() => {
                onItemClick(
                  item._id,
                  item.last_name +
                    ', ' +
                    item.first_name +
                    ' ' +
                    (item.company_name === null ? '' : item.company_name)
                );
                _isMounted.current = false;
                setMembersVisible('hidden');
              }}
            >
              <div>
                {item.last_name +
                  ', ' +
                  item.first_name +
                  ' ' +
                  (item.company_name === null ? '' : item.company_name)}
              </div>
            </div>
          );
        })}
        {memberList.length == 0 ? (
          <div className="item-blank">No members found.</div>
        ) : null}
      </div>
    </div>
  );
}

export default ListItems;
