using System.ComponentModel.DataAnnotations; // You MUST have this line!

namespace TalentFlow.API.Models
{
    public class Evaluation
    {
        [Key]
        public int Id { get; set; }
        // ... rest of your code
    }
}