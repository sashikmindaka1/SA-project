using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalentFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateApplicationModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Candidate",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Initials",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Skills",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Candidate",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Initials",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "Applications");

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "Applications",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
