export class CreateProfileDto {
  public user_id: string;
  public name: string;
  public gender: string;
  public date_of_birth: string;
  public height: number;
  public weight: number;
  public interest: [string];
  public image: any;
}
