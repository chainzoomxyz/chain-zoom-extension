import { Box, FormControl, Stack, TextField, Typography } from '@mui/material';
import { pxToRem } from '@/theme/foundations';
import { images } from '@/utils/images';
import React, { type SetStateAction, useState } from 'react';
import { useMetaMask } from 'providers/MetamaskProvider';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateRefCodeMutation } from '@/hooks';
import _ from 'lodash';
import { copyToClipboard } from '@/utils/helper';
import { ALERT_MESSAGES } from '@/utils/messages';

const validation = Yup.object({
  refCode: Yup.string()
    .required('Required')
    .length(9, 'Invalid ref code')
    .matches(/^[A-Z0-9]*$/, 'Invalid ref xcode'),
});

export const EditableRefCode = (props: { refCode: string }) => {
  const { profile, setAlertMessage, setOpenAlert } = useMetaMask();
  const [isEdit, setIsEdit] = useState(false);
  const {
    formState: { isSubmitting, errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: { refCode: props.refCode },
    // @ts-ignore
    resolver: yupResolver(validation),
    mode: 'all',
  });

  const updateRefCodeMutation = useUpdateRefCodeMutation();

  const onSubmit = async (payload: any) => {
    try {
      await updateRefCodeMutation.mutateAsync(payload);
      setAlertMessage(ALERT_MESSAGES.UPDATE_REF_CODE_SUCCESS);
      setOpenAlert(true);
      setIsEdit(false);
    } catch (e) {
      console.log(e);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="refCode"
        control={control}
        render={({ field }) => {
          return (
            <FormControl fullWidth>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                height={29}
                borderRadius={pxToRem(8)}
                width={1}
                bgcolor={'common.white'}
                overflow={'hidden'}
              >
                <TextField
                  {...field}
                  value={field.value}
                  disabled={
                    (isSubmitting && _.get(profile, 'userProfile.isRefCodeUpdatedByUser', false)) ||
                    !isEdit
                  }
                  sx={{
                    height: 1,
                    '& .MuiInputBase-input': {
                      padding: '0 8px',
                      fontSize: 12,
                    },
                    '& .MuiInputBase-root.Mui-disabled': {
                      color: 'rgba(0, 0, 0, 0.6)', // (default alpha is 0.38)
                    },
                    '& .MuiInputBase-root': {
                      backgroundColor: '#fff',
                    },
                    color: '#000',
                    width: 140,
                    input: {
                      color: '#000 !important',
                    },
                  }}
                  inputProps={{
                    maxLength: 9,
                  }}
                  InputProps={{
                    disabled: false,
                    disableUnderline: true,
                    endAdornment: (
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        mr={isEdit ? 1 : 1}
                        gap={1}
                        flexDirection={'row'}
                      >
                        {isEdit && (
                          <Typography color={'text.secondary'} variant={'body2'}>
                            {field.value.length}/9
                          </Typography>
                        )}
                        <EndAdornmentIcon
                          isRefCodeUpdatedByUser={_.get(
                            profile,
                            'userProfile.isRefCodeUpdatedByUser',
                            false,
                          )}
                          isEdit={isEdit}
                          errors={errors}
                          setIsEdit={setIsEdit}
                          refCode={field.value}
                        />
                      </Box>
                    ),
                  }}
                  type={'text'}
                  onChange={(event) => field.onChange(event.target.value.toUpperCase().trim())}
                  variant={'filled'}
                />
              </Stack>
            </FormControl>
          );
        }}
      />
    </form>
  );
};

const EndAdornmentIcon = (props: {
  isRefCodeUpdatedByUser: boolean;
  isEdit: boolean;
  errors: any;
  setIsEdit: React.Dispatch<SetStateAction<boolean>>;
  refCode: string;
}) => {
  const { setAlertMessage, setOpenAlert } = useMetaMask();
  return (
    <Stack
      direction={'row'}
      width={16}
      mr={!props.isRefCodeUpdatedByUser && !props.isEdit ? pxToRem(8) : pxToRem(4)}
      height={16}
      gap={pxToRem(4)}
      sx={{ cursor: 'pointer' }}
    >
      {!props.isRefCodeUpdatedByUser && !props.isEdit && (
        <img onClick={() => props.setIsEdit(true)} src={images.iconEditDark} alt="" />
      )}

      {!props.isRefCodeUpdatedByUser && props.isEdit && (
        <img src={props.errors?.refCode ? images.iconFailed : images.iconSuccess} alt="" />
      )}
      {!props.isEdit && (
        <img
          src={images.iconCopyDark}
          alt=""
          onClick={() => {
            setAlertMessage(ALERT_MESSAGES.COPY_REF_CODE_SUCCESS);
            setOpenAlert(true);
            copyToClipboard(props.refCode);
          }}
        />
      )}
    </Stack>
  );
};
