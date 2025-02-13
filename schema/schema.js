// schema/schema.js

const graphql = require('graphql');
const Employee = require('../models/Employee');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema
} = graphql;

// Define Employee GraphQL Type
const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    department: { type: GraphQLString },
    position: { type: GraphQLString },
    salary: { type: GraphQLInt }
  })
});

// Root Query definition
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Retrieve all employees
    employees: {
      type: new GraphQLList(EmployeeType),
      resolve(parent, args) {
        return Employee.find({});
      }
    },
    // Retrieve a single employee by ID
    employee: {
      type: EmployeeType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        try {
          const employee = await Employee.findById(args.id);
          if (!employee) {
            throw new Error('Employee not found');
          }
          return employee;
        } catch (err) {
          throw new Error(err);
        }
      }
    }
  }
});

// Mutation definitions
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add a new employee
    addEmployee: {
      type: EmployeeType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        department: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: new GraphQLNonNull(GraphQLString) },
        salary: { type: new GraphQLNonNull(GraphQLInt) }
      },
      async resolve(parent, args) {
        try {
          const employee = new Employee({
            name: args.name,
            age: args.age,
            department: args.department,
            position: args.position,
            salary: args.salary
          });
          return await employee.save();
        } catch (err) {
          throw new Error(err);
        }
      }
    },
    // Update an existing employee
    updateEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        department: { type: GraphQLString },
        position: { type: GraphQLString },
        salary: { type: GraphQLInt }
      },
      async resolve(parent, args) {
        try {
          const updatedEmployee = await Employee.findByIdAndUpdate(
            args.id,
            { $set: args },
            { new: true }
          );
          if (!updatedEmployee) {
            throw new Error('Employee not found or update failed');
          }
          return updatedEmployee;
        } catch (err) {
          throw new Error(err);
        }
      }
    },
    // Delete an employee
    deleteEmployee: {
        type: EmployeeType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) }
        },
        async resolve(parent, args) {
          try {
            // findByIdAndDelete metodu kullanılıyor
            const deletedEmployee = await Employee.findByIdAndDelete(args.id);
            if (!deletedEmployee) {
              throw new Error('Employee not found or deletion failed');
            }
            return deletedEmployee;
          } catch (err) {
            throw new Error(err);
          }
        }
      }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
