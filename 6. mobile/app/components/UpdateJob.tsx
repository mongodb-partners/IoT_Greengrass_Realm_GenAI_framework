import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput, Alert } from 'react-native';
import { Job } from '../models/schema';
import { colors } from '../styles/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

type ItemProps = {
  job: Job;
  onItemUpdate: (value: string, notes: string, job: Job) => void;
  onClose: () => void;
};

export const UpdateJob = ({ job, onItemUpdate, onClose }: ItemProps) => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    { label: 'INPROGRESS', value: 'INPROGRESS' },
    { label: 'CANCELLED', value: 'CANCELLED' },
    { label: 'COMPLETED', value: 'COMPLETED' },
  ]);

  useEffect(() => {
    setValue(job.status);
    setNotes(job.notes);

    if (job.status == 'CANCELLED' || job.status == 'COMPLETED') {
      setDisabled(true)
    }
  }, [job]);


  const navigateToChatScreen = () => {
    const params = {
      jobId: job._id.toString(),
    }
    //console.log(params.jobId);
    navigation.navigate('Help', params);
    onClose();
  };

  const update = (status: string, notes: string, job: Job) => {
    if (value !== null && value !== 'TODO' && notes.length > 5) {
      
      onItemUpdate(status, notes, job);
      onClose();

    } else {
      Alert.alert('Please fill the mondatory fields or select proper values');
    }
  };


  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Job Detail</Text>
              </View>
              <Pressable style={styles.authButton} onPress={() => navigateToChatScreen()}>
                <Text style={styles.authButtonText}>Help</Text>
              </Pressable>
            </View>

            <Text style={[styles.title]}> Vehicle </Text>
            <TextInput style={styles.input} editable={false} selectTextOnFocus={false} value={job.vehicleId.make + ' ' + job.vehicleId.model} />
            <Text style={[styles.title]}> Vin No.</Text>
            <TextInput style={styles.input} editable={false} selectTextOnFocus={false} value={job.vehicleId.vin} />
            <Text style={[styles.title]}> Service Type</Text>
            <TextInput style={styles.input} editable={false} selectTextOnFocus={false} value={job.type} />

            <Text style={[styles.title]}> Status</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              disabledStyle={{
                opacity: 0.5
              }}
              disabled={disabled}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
            <Text style={[styles.title, { marginTop: 10 }]}> Notes</Text>
            <TextInput
              style={styles.multiinput}
              multiline={true}
              editable={!disabled}
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.buttons}>
              <Pressable
                onPress={() => onClose()}
                style={styles.button}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
              <Pressable
                disabled={disabled}
                onPress={() => update(value, notes, job)}
                style={styles.button}>
                <Text style={styles.buttonText}>Update</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    alignSelf: 'stretch',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.grayDark,
    fontSize: 16,
    color: colors.grayDark,
  },
  multiinput: {
    alignSelf: 'stretch',
    marginBottom: 10,
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.grayDark,
    fontSize: 16,
    color: colors.grayDark,
  },
  button: {
    width: 120,
    marginHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 2,
    marginBottom: 20,
    borderColor: colors.purple,
    backgroundColor: colors.white,
  },
  titleContainer: {
    paddingLeft: 10,
    alignItems: 'center',
  },
  authButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 5,
    borderColor: colors.grayMedium,
  },
  authButtonText: {
    fontWeight: 'bold',
    color: colors.black,
  },
  title: {
    fontSize: 15,
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.white,
  },
});

export default UpdateJob;