
import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/colors';
import { Job } from '../models/schema';
import UpdateJob from './UpdateJob';

type ItemProps = {
  job: Job;
  onUpdate: (value: string, notes: string, job: Job) => void;
};

export const JobItem = memo<ItemProps>(
  ({ job, onUpdate }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Job | null>(null);

    const closeModel = () => {
      setModalVisible(false);
    };

    const handleItemPress = (visible: boolean) => {
      console.log(visible);
      setSelectedItem(job);
      setModalVisible(visible);
    };


    return (
      <View>
        <View style={[styles.job]}>
          <View style={styles.dataContainer}>
            <Text numberOfLines={1}
              style={[
                styles.vehicle
              ]}>
              {job.vehicleId.make + ' ' + job.vehicleId.model}
            </Text>

            <Text numberOfLines={1}
              style={[
                styles.type
              ]}>
              Service Type : {job.type}
            </Text>

            <Text
              numberOfLines={1}
              style={[
                styles.notes
              ]}>
              Notes : {job.notes}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Update Job"
            onPress={() => handleItemPress(!modalVisible)}
            style={styles.deleteButton}>
            <Text style={styles.deleteIcon}>></Text>
          </Pressable>
        </View>
        {modalVisible ? (
          <UpdateJob
            job={selectedItem}
            onItemUpdate={onUpdate}
            onClose={closeModel}></UpdateJob>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  job: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    padding: 5,
    borderColor: colors.grayMedium,
    backgroundColor: colors.white,
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicle: {
    fontSize: 15,
    padding: 5,
    color: colors.black,
    fontWeight: 'bold'
  },
  type: {
    fontSize: 12,
    padding: 5,
    color: colors.grayDark,
  },

  notes: {
    fontSize: 12,
    padding: 5,
    color: colors.grayDark,
  },
  descriptionCompleted: {
    color: colors.white,
  },
  status: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    borderRadius: 5,
    borderRightWidth: 1,
    borderColor: colors.grayMedium,
    backgroundColor: colors.white,
  },
  deleteButton: {
    width: 30,
    height: 30,
    marginRight: 10,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 30,
    borderColor: colors.black,
    backgroundColor: colors.white,
  },
  deleteIcon: {
    marginTop: -2,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
});
