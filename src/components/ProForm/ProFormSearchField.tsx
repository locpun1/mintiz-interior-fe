import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, debounce } from '@mui/material';
import TextField from '@mui/material/TextField';
import { memo, useEffect, useState } from 'react';
import type { ChangeEvent, KeyDownEvent } from '@/types/react';
import ProFormLabel from './ProFormLabel';

interface Props {
  name: string;
  label: string;
  placeHolder: string;
  onSearch: (searchValue: string) => void;
  searchText: string;
}

const ProFormSearchField = (props: Props) => {
  const { name, label, searchText, placeHolder, onSearch } = props;
  const [value, setValue] = useState<string>('');

  const handleChange: ChangeEvent = (event) => {
    const value = event.target.value;
    setValue(value);
    debouncedSearch(value);
  };

  const handleKeyDown: KeyDownEvent = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSearch(value);
    }
  };

  const debouncedSearch = debounce((newValue: string) => {
    if (newValue !== searchText) {
      onSearch(newValue);
    }
  }, 350);

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, [debouncedSearch]);

  return (
    <ProFormLabel name={name} title={label} gutterBottom>
      <TextField
        id={name}
        fullWidth
        placeholder={placeHolder}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <SearchIcon fontSize='medium' />
            </InputAdornment>
          ),
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </ProFormLabel>
  );
};

export default memo(ProFormSearchField);
