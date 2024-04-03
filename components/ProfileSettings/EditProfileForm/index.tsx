import { Box, Button, FormControl, Stack, TextField, Typography } from '@mui/material';
import { images } from '@/utils/images';
import { pxToRem } from '@/theme/foundations';
import { Controller, useForm } from 'react-hook-form';
import React, { useRef } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateUserDetailMutation, useUploadFileMutation } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/utils/query-key';
import { useMetaMask } from 'providers/MetamaskProvider';
import { ALERT_MESSAGES } from '@/utils/messages';
import _ from 'lodash';
import { formatAddress } from '@/utils/helper';

const validation = Yup.object({
  userName: Yup.string().nullable().required('Required'),
  avatar: Yup.string().nullable(),
});

export const EditProfileForm = () => {
  const queryClient = useQueryClient();
  const { wallet, profile, setOpenAlert, setAlertMessage } = useMetaMask();

  const {
    formState: { isSubmitting },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      userName: _.get(profile, 'userProfile.userName', ''),
      avatar: _.get(profile, 'userProfile.profilePictureUrl', ''),
    },
    // @ts-ignore
    resolver: yupResolver(validation),
    mode: 'onSubmit',
  });

  const avatarRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const uploadFileMutation = useUploadFileMutation();
  const updateUserDetailMutation = useUpdateUserDetailMutation();

  const onSubmit = async (payload: any) => {
    try {
      if (selectedFile) {
        await uploadFileMutation.mutateAsync(selectedFile);
      }
      await updateUserDetailMutation.mutateAsync({
        userName: payload.userName,
      });
      queryClient.invalidateQueries([QUERY_KEY.USER_DETAIL]);
      setAlertMessage(ALERT_MESSAGES.UPDATE_PROFILE_SUCCESS);
      setOpenAlert(true);
    } catch (e) {
      console.log(e);
      setAlertMessage(e.response?.data?.message ? e.response?.data?.message : e.response?.data);
      setOpenAlert(true);
    }
  };

  return (
    <Stack component={'form'} onSubmit={handleSubmit(onSubmit)} width={1} position={'relative'}>
      <Stack
        width={100}
        height={100}
        position={'absolute'}
        left={'50%'}
        sx={{
          transform: 'translate(-50%,-50%)',
          cursor: 'pointer',
        }}
        borderRadius={pxToRem(24)}
        justifyContent={'center'}
        alignItems={'center'}
        bgcolor={'background.lighter'}
      >
        <Controller
          control={control}
          name="avatar"
          render={({ field, fieldState }) => (
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              width={1}
              height={1}
              position={'relative'}
            >
              <Box
                onClick={() => avatarRef.current?.click()}
                width={1}
                height={1}
                borderRadius={pxToRem(24)}
                overflow={'hidden'}
              >
                <img
                  src={field.value ? field.value : images.avatarDefaultProfile}
                  alt=""
                  width={'100%'}
                  height={'100%'}
                />
              </Box>

              <input
                onChange={(e) => {
                  setSelectedFile(e.target?.files?.[0]!);
                  field.onChange(URL.createObjectURL(e.target?.files?.[0]!));
                }}
                hidden
                type="file"
                ref={avatarRef}
                accept="image/*"
              />
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                position={'absolute'}
                bottom={0}
                right={0}
                sx={{ transform: 'translateX(50%)' }}
                width={26}
                height={26}
                borderRadius={'50%'}
                bgcolor={'common.white'}
                onClick={() => avatarRef.current?.click()}
              >
                <Box width={12} height={12}>
                  <img src={images.iconEditDark} alt="" />
                </Box>
              </Stack>
            </Stack>
          )}
        />
      </Stack>
      <Box mt={pxToRem(60)} textAlign={'center'}>
        <Typography variant={'h3'}>
          {formatAddress(_.nth(_.get(wallet, 'accounts', [])))}
        </Typography>
      </Box>
      <Stack gap={pxToRem(8)} width={1}>
        <Typography variant={'body1'} color={'common.white'}>
          Display name
        </Typography>
        <Box
          width={1}
          borderRadius={pxToRem(6)}
          height={42}
          sx={(theme) => ({ border: `1px solid ${theme.palette.border.dark}` })}
        >
          <Controller
            name="userName"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    value={field.value}
                    size={'medium'}
                    variant={'outlined'}
                    inputProps={{
                      maxLength: 10,
                    }}
                    sx={{
                      height: 1,
                      width: 1,
                      '& .MuiInputBase-input': {
                        padding: '0 16px',
                        fontSize: 20,
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <Typography variant={'body2'} sx={{ opacity: 0.6 }}>
                          {field.value.length}/10
                        </Typography>
                      ),
                    }}
                    helperText={fieldState?.error?.message ?? ''}
                    onChange={(event) => field.onChange(event.target.value.trim().toLowerCase())}
                    placeholder={'yourname'}
                  />
                </FormControl>
              );
            }}
          />
        </Box>
        <Stack width={1} height={42} mt={pxToRem(12)}>
          <Button
            type={'submit'}
            fullWidth
            disabled={isSubmitting}
            variant={'soft'}
            color={'success'}
            size={'large'}
            sx={{ fontWeight: 'bold' }}
          >
            Save change
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
