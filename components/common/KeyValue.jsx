import React, { useState } from 'react'
import Input from './Input'
import { Icon } from '@iconify/react'
import social from '@/config/social'

const KeyValueList = ({
  t,
  keyValueList = [],
  setKeyValueList,
  label,
  error,
  required,
  open = false,
  disabled,
  keyOptions,
  allowedSocial,
}) => {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [editIndex, setEditIndex] = useState(null)
  const [isExpand, setIsExpand] = useState(open)

  const handleAddItem = () => {
    if (newKey && newValue) {
      setKeyValueList([...keyValueList, { type: newKey, value: newValue }])
      setNewKey('')
      setNewValue('')
    }
  }

  const handleEditItem = index => {
    setEditIndex(index)
    setNewKey(keyValueList[index].type)
    setNewValue(keyValueList[index].value)
  }

  const handleSaveEdit = () => {
    if (editIndex !== null && newKey && newValue) {
      const updatedList = [...keyValueList]
      updatedList[editIndex] = {
        ...updatedList[editIndex],
        type: newKey,
        value: newValue,
      }
      setKeyValueList(updatedList)
      setNewKey('')
      setNewValue('')
      setEditIndex(null)
    }
  }

  const handleDeleteItem = index => {
    const updatedList = [...keyValueList]
    updatedList.splice(index, 1)
    setKeyValueList(updatedList)
    setEditIndex(null)
  }

  const allowedSocials = allowedSocial
    ? social?.filter(i => allowedSocial.includes(i.type))
    : social

  const filteredOptions = keyOptions
    ? keyOptions
    : allowedSocials.filter(
        item => !keyValueList.some(i => i.type === item.value)
      )

  // if (filteredOptions?.length <= 1 || !editIndex) return null

  return (
    <div className='key-value-list'>
      <label className='header-label' onClick={() => setIsExpand(!isExpand)}>
        {label || ''} {required && <span className='text-danger'>*</span>}
        <span className='toggle-icon'>
          {isExpand ? (
            <Icon icon='mingcute:up-line' />
          ) : (
            <Icon icon='mingcute:down-line' />
          )}
        </span>
      </label>
      {isExpand && (
        <>
          {(filteredOptions?.length >= 1 || editIndex) && (
            <div className='key-value-input-container'>
              <Input
                label={t('form.fields.type')}
                type='select'
                id='type'
                name='type'
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                options={[
                  {
                    value: '',
                    selected: true,
                    label: t('form.fields.select'),
                  },
                  ...filteredOptions,
                ]}
                error={!newKey && 'Social type is required'}
              />
              <Input
                name='value'
                type='text'
                id='value'
                label={t('form.fields.url')}
                placeholder='value'
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                error={!newValue && 'Social url is required'}
              />

              <button
                className='button'
                disabled={!newKey || !newValue}
                onClick={editIndex !== null ? handleSaveEdit : handleAddItem}
              >
                {editIndex !== null ? t('edit') : t('create')}
              </button>
            </div>
          )}

          {/* {error && <div className='error'>{error}</div>} */}
          <ul className='list-items'>
            {keyValueList?.length > 0 &&
              keyValueList?.map((item, index) => (
                <li key={item.type} className='list-item'>
                  <span>
                    <b>{t('list.type')}:</b> {item.type}
                  </span>
                  <span>
                    <b>{t('list.value')}:</b>{' '}
                    {item.value?.length > 40
                      ? `${item?.value?.slice(0, 40)}...`
                      : item?.value}
                  </span>

                  <div className='list-items-button'>
                    {/* <Icon
                      icon='akar-icons:edit'
                      className='edit'
                      onClick={() => handleEditItem(index)}
                      width={20}
                      height={20}
                    /> */}
                    <Icon
                      icon='fluent:delete-12-regular'
                      className='delete'
                      onClick={() => handleDeleteItem(index)}
                      width={20}
                      height={20}
                    />
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default KeyValueList
