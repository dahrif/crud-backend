import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member.model';
import { MemberService } from 'src/app/_services/member.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  
  members?: Member[];
  currentMember: any;
  currentIndex = -1;
  username = '';

  constructor(private memberService: MemberService, private tokenStorageService: TokenStorageService,private userService: UserService,private router : Router) { }

  ngOnInit() : void{
    this.retrieveMembers();

    this.currentMember = this.tokenStorageService.getUser();

    this.userService.getAdminBoard().subscribe(
      data => {
        this.members = data;
      },
      err => {
        this.router.navigate(['/login'])
         return false
      }
    );
  }

  logout(): void{
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  retrieveMembers(): void {
    this.memberService.getAll()
      .subscribe(
        data => {
          this.members = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveMembers();
    this.currentMember = {};
    this.currentIndex = -1;
  }

  setActiveMembers(members: Member, index: number): void {
    this.currentMember = members;
    this.currentIndex = index;
    console.log(members);
    
  }

  deleteMember(): void {
    this.memberService.delete(this.currentMember._id)
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  removeAllMembers(): void {
    this.memberService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.logout();
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  searchUsername(): void {
    this.currentMember = {};
    this.currentIndex = -1;

    this.memberService.findByUsername(this.username)
      .subscribe(
        data => {
          this.members = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }



}
