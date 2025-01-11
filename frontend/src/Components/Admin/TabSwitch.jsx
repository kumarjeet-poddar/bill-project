import { Box, Tab, Tabs } from '@mui/material';

export default function TabSwitch(props) {
  const { value, onChange } = props;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={onChange}
          textColor="primary"
          aria-label="wrapped label tabs example"
        >
          <Tab value={0} label="Arrange Sequence" />
          <Tab value={1} label="Add Requirements" />
        </Tabs>
      </Box>
    </>
  );
}
