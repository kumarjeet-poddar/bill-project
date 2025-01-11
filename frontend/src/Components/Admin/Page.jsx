import { useState } from 'react';
import TabSwitch from './TabSwitch';
import Sequence from './Sequence';

export default function Admin() {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <>
      <div className="w-full min-h-screen bg-gray-100 p-10 pb-0">
        <div className="max-w-[1400px]">
          <TabSwitch value={tabValue} onChange={handleChange} />
          {tabValue == 0 ? <Sequence /> : null}
        </div>
      </div>
    </>
  );
}
