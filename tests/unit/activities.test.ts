import activitiesRepository from '@/repositories/activities-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import activitiesService from '@/services/activities-service';
import { TicketStatus } from '@prisma/client';
import { createMockEnrollmentWithAddres, createMockTicket, createMockTicketType, createMockUser } from '../factories';
import { createMockDates } from '../factories/activities-factory';

describe('Activities unit suite', () => {
  describe('GetDates unit tests', () => {
    test('Should not get any dates when user does not have enrollment', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(() => {
        return undefined;
      });
      const user = createMockUser();
      try {
        const promise = await activitiesService.getStages(user.id);
      } catch (err) {
        expect(err).toEqual({
          name: 'NotFoundError',
          message: 'No result for this search!',
        });
      }
    });

    test('Should not get any dates when user does not have ticket', async () => {
      const user = createMockUser();
      const enrollment = createMockEnrollmentWithAddres(user);

      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return enrollment;
      });

      jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return undefined;
      });

      try {
        const promise = await activitiesService.getStages(user.id);
      } catch (err) {
        expect(err).toEqual({
          name: 'NotFoundError',
          message: 'No result for this search!',
        });
      }
    });

    test('Should not get any dates when user ticket type is Remote', async () => {
      const user = createMockUser();
      const enrollment = createMockEnrollmentWithAddres(user);
      const ticketType = createMockTicketType(true, false);
      const ticket = createMockTicket(TicketStatus.RESERVED, ticketType);

      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return enrollment;
      });

      jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return ticket;
      });

      try {
        const promise = await activitiesService.getStages(user.id);
      } catch (err) {
        expect(err).toEqual({
          name: 'UnauthorizedError',
          message: 'You must be signed in to continue',
        });
      }
    });

    test('Should not get any dates when user ticket type is not Paid', async () => {
      const user = createMockUser();
      const enrollment = createMockEnrollmentWithAddres(user);
      const ticketType = createMockTicketType(false, true);
      const ticket = createMockTicket(TicketStatus.RESERVED, ticketType);

      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return enrollment;
      });

      jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return ticket;
      });

      try {
        const promise = await activitiesService.getStages(user.id);
      } catch (err) {
        expect(err).toEqual({
          name: 'PaymentRequiredError',
          message: 'Payment required!',
        });
      }
    });

    test('Should get dates when user ticket is valid', async () => {
      const user = createMockUser();
      const enrollment = createMockEnrollmentWithAddres(user);
      const ticketType = createMockTicketType(false, true);
      const ticket = createMockTicket(TicketStatus.PAID, ticketType);
      const dates = createMockDates();

      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
        return enrollment;
      });

      jest.spyOn(ticketRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
        return ticket;
      });

      jest.spyOn(activitiesRepository, 'findDates').mockImplementationOnce((): any => {
        return dates;
      });

      let response;

      try {
        response = await activitiesService.getDates(user.id);
      } catch (err) {}

      expect(response).toEqual(dates);
    });
  });
});
