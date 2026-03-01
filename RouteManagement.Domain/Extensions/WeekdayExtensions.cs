using RouteManagement.Domain.Enums;

namespace RouteManagement.Domain.Extensions
{
    public static class WeekdayExtensions
    {
        public static WeekDay ToWeekday(this DateTime date)
        {
            var d = (int)date.DayOfWeek;
            return d == 0 ? WeekDay.Sunday : (WeekDay)d;
        }
    }
}
