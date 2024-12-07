<template>
    <div class="time-off-request">
      <h2>Submit Time Off Request</h2>
      <form @submit.prevent="submitRequest">
        <div class="form-group">
          <label>Request Type</label>
          <select v-model="requestType">
            <option>Vacation</option>
            <option>Sick Leave</option>
            <option>Personal Day</option>
          </select>
        </div>
        <div class="form-group">
          <label>Start Date</label>
          <input type="date" v-model="startDate" required>
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="date" v-model="endDate" required>
        </div>
        <div class="form-group">
          <label>Reason</label>
          <textarea v-model="reason"></textarea>
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TimeOffRequest',
    data() {
      return {
        requestType: 'Vacation',
        startDate: '',
        endDate: '',
        reason: ''
      }
    },
    methods: {
      submitRequest() {
        // Validate and submit request
        console.log('Time off request submitted', this.$data)
        alert('Time Off Request Submitted!')
      }
    }
  }
  </script>